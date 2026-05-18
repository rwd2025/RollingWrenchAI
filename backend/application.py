from core_engine import MasterTunerCore, TunerTask
from drivers import MultiModeHardwareLink
import time

hardware = MultiModeHardwareLink(mode="BENCH")

if hardware.open_channel():

    engine = MasterTunerCore()
    engine.start()

    engine.queue_task(TunerTask("CONNECT"))

    time.sleep(1)

    engine.queue_task(
        TunerTask(
            "FLASH",
            payload=b"DUMMY_BINARY_DATA"
        )
    )

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        engine.shutdown()
        hardware.close_channel()
