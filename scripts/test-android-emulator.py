#!/usr/bin/env python3
"""Native Android emulator smoke: launch actual debug APK and test UI + Back.
Requires: booted Android emulator, Metro on host port 8081, and built debug APK.
Run in GitHub Actions emulator-runner. No 3rd-party Python packages.
"""
import os
import re
import subprocess
import time
import xml.etree.ElementTree as ET
from pathlib import Path

PACKAGE = "uz.hisobchi.mobile"
APK = Path("android/app/build/outputs/apk/debug/app-debug.apk")
ARTIFACTS = Path("artifacts/android-emulator")
ARTIFACTS.mkdir(parents=True, exist_ok=True)

def adb(*arguments, timeout=50):
    result = subprocess.run(
        ["adb", *arguments], text=True, encoding="utf-8",
        errors="replace", capture_output=True, timeout=timeout,
    )
    if result.returncode:
        raise RuntimeError(f"adb {arguments}: {result.stdout}\n{result.stderr}")
    return result.stdout

def screenshot(name):
    dest = ARTIFACTS / f"{name}.png"
    with dest.open("wb") as stream:
        subprocess.run(["adb", "exec-out", "screencap", "-p"], stdout=stream,
                       stderr=subprocess.PIPE, check=True, timeout=35)
    if dest.stat().st_size < 1500:
        raise AssertionError(f"Screenshot {name} unexpectedly small")
    print("Screenshot:", dest)

def xml_nodes():
    # uiautomator includes native Text and accessibility content descriptions.
    adb("shell", "uiautomator", "dump", "/sdcard/hisobchi-ui.xml", timeout=35)
    result = subprocess.run(["adb", "exec-out", "cat", "/sdcard/hisobchi-ui.xml"],
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=35)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors="replace"))
    (ARTIFACTS / "last-ui.xml").write_bytes(result.stdout)
    return list(ET.fromstring(result.stdout).iter("node"))

def label(node):
    return node.attrib.get("content-desc", "") + " " + node.attrib.get("text", "")

def find_node(fragment, timeout_seconds=100):
    started = time.monotonic()
    last = ""
    while time.monotonic() - started < timeout_seconds:
        try:
            nodes = xml_nodes()
            matches = [node for node in nodes if fragment in label(node)]
            if matches:
                print("Found:", fragment, "in", label(matches[0]).strip())
                return matches[0]
            last = " | ".join(label(node).strip() for node in nodes if label(node).strip())[:600]
        except Exception as exc:
            last = str(exc)
        time.sleep(3)
    raise AssertionError(f"Couldn't find '{fragment}' on Android screen. Visible: {last}")

def tap_node(fragment):
    node = find_node(fragment, timeout_seconds=45)
    bounds = node.attrib.get("bounds", "")
    coordinates = list(map(int, re.findall(r"\d+", bounds)))
    if len(coordinates) != 4:
        raise AssertionError(f"No valid bounds for '{fragment}': {bounds}")
    x = (coordinates[0] + coordinates[2]) // 2
    y = (coordinates[1] + coordinates[3]) // 2
    adb("shell", "input", "tap", str(x), str(y))
    time.sleep(2)

def back():
    adb("shell", "input", "keyevent", "KEYCODE_BACK")
    time.sleep(2)

def assert_no_native_crash():
    native_errors = adb("logcat", "-d", "-s", "AndroidRuntime:E", "ReactNativeJS:E", timeout=40)
    if "FATAL EXCEPTION" in native_errors or "Unable to load script" in native_errors:
        raise AssertionError("Native crash / JS bundle failure:\n" + native_errors[-6000:])
    (ARTIFACTS / "android-errors.log").write_text(native_errors[-12000:], encoding="utf-8")

def main():
    if not APK.exists():
        raise FileNotFoundError(f"APK not built: {APK}")
    print("Debug APK size:", APK.stat().st_size)
    print(adb("devices"))
    adb("install", "-r", str(APK), timeout=130)
    adb("reverse", "tcp:8081", "tcp:8081")
    adb("logcat", "-c")
    adb("shell", "am", "force-stop", PACKAGE)
    print(adb("shell", "am", "start", "-n", PACKAGE + "/.MainActivity"))
    try:
        find_node("Umumiy balans", timeout_seconds=150)
        screenshot("01-dashboard")
        tap_node("Operatsiyalar")
        find_node("Jami kirim")
        screenshot("02-transactions")
        tap_node("Yangi operatsiya qo‘shish")
        find_node("Yangi operatsiya")
        screenshot("03-editor")
        tap_node("Operatsiya sanasi:")
        find_node("Sanani tanlang")
        screenshot("04-calendar")
        # Native onRequestClose must dismiss Modal before parent navigation.
        back()
        find_node("Yangi operatsiya")
        # Native Back should return from editor without closing the whole app.
        back()
        find_node("Jami kirim")
        # Native Back on a secondary tab should restore the Home screen.
        back()
        find_node("Umumiy balans")
        screenshot("05-back-to-home")
        assert_no_native_crash()
        print("PASS: installed APK, rendered screens, opened date Modal and handled Android Back.")
    except Exception:
        try:
            screenshot("failure")
            (ARTIFACTS / "full-logcat-tail.log").write_text(
                adb("logcat", "-d", "-t", "800", timeout=40), encoding="utf-8")
        except Exception as capture_exc:
            print("Diagnostic capture failed:", capture_exc)
        raise

if __name__ == "__main__":
    main()
