import time

class BootTriCoreInterface:

    def __init__(self):
        self.connected = False

    def connect_boot_mode(self):

        print("[BOOT] Applying Boot Mode Voltage")

        time.sleep(1)

        print("[BOOT] Connecting To TriCore Processor")

        self.connected = True

        return True

    def read_full_flash(self):

        if not self.connected:
            return None

        print("[BOOT] Reading Internal Flash")

        flash = bytearray()

        for i in range(100):

            flash.extend(b"\x00" * 1024)

            progress = (i + 1)

            print(f"[BOOT] Read Progress: {progress}%")

            time.sleep(0.02)

        return flash

    def write_full_flash(self, binary_data):

        if not self.connected:
            return False

        total = len(binary_data)
        written = 0

        while written < total:

            written += 1024

            progress = (written / total) * 100

            print(f"[BOOT] Write Progress: {progress:.1f}%")

            time.sleep(0.02)

        print("[BOOT] Flash Write Complete")

        return True
