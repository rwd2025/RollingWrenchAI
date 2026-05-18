import threading
import queue
import time
import enum

class EngineState(enum.Enum):
    IDLE = 0
    CONNECTED = 1
    FLASHING = 2
    ERROR = 3

class TunerTask:
    def __init__(self, action, payload=None):
        self.action = action
        self.payload = payload

class MasterTunerCore(threading.Thread):

    def __init__(self):
        super().__init__()
        self.tasks = queue.Queue()
        self.running = True
        self.state = EngineState.IDLE

    def queue_task(self, task):
        self.tasks.put(task)

    def shutdown(self):
        self.running = False

    def run(self):

        while self.running:

            try:
                task = self.tasks.get(timeout=0.1)

                if task.action == "CONNECT":
                    self.state = EngineState.CONNECTED
                    print("[ENGINE] Connected")

                elif task.action == "FLASH":
                    self.state = EngineState.FLASHING

                    for i in range(1, 101):
                        print(f"[FLASH] {i}%")
                        time.sleep(0.05)

                    self.state = EngineState.CONNECTED
                    print("[ENGINE] Flash Complete")

            except queue.Empty:
                continue
