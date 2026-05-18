import time

class UdsFlashingEngine:

    def __init__(self, vci, tx_id, rx_id):
        self.vci = vci
        self.tx_id = tx_id
        self.rx_id = rx_id

    def request_programming_session(self):

        print("[UDS] Requesting Programming Session")
        self.vci.send_frame(self.tx_id, bytes([0x10, 0x02]))
        return True

    def unlock_security_access(self):

        print("[UDS] Unlocking Security Access")

        self.vci.send_frame(self.tx_id, bytes([0x27, 0x01]))

        seed = b"\x12\x34\x56\x78"

        print(f"[UDS] Seed Received: {seed.hex()}")

        key = b"\xAA\xBB\xCC\xDD"

        self.vci.send_frame(
            self.tx_id,
            bytes([0x27, 0x02]) + key
        )

        return True

    def transfer_file(self, binary_data):

        total = len(binary_data)
        sent = 0
        chunk_size = 256
        block = 1

        while sent < total:

            chunk = binary_data[sent:sent+chunk_size]

            payload = bytes([0x36, block]) + chunk

            self.vci.send_frame(self.tx_id, payload)

            sent += len(chunk)

            progress = (sent / total) * 100

            print(f"[UDS] Flash Progress: {progress:.1f}%")

            block += 1

            time.sleep(0.02)

        self.vci.send_frame(self.tx_id, bytes([0x37]))

        print("[UDS] Transfer Complete")

        return True
