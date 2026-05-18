class MultiModeHardwareLink:

    def __init__(self, mode="OBD"):
        self.mode = mode
        self.connected = False

    def open_channel(self):

        print(f"[HARDWARE] Opening {self.mode} connection...")
        self.connected = True
        return True

    def close_channel(self):

        print("[HARDWARE] Closing connection...")
        self.connected = False

    def send(self, data):

        if not self.connected:
            return False

        print(f"[TX] {data}")
        return True

    def receive(self):

        if not self.connected:
            return None

        return b"OK"
