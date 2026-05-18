from abc import ABC, abstractmethod

class BaseVCI(ABC):

    @abstractmethod
    def connect(self, connection_string: str) -> bool:
        pass

    @abstractmethod
    def disconnect(self) -> bool:
        pass

    @abstractmethod
    def send_frame(self, can_id: int, data: bytes) -> bool:
        pass

    @abstractmethod
    def read_frame(self, timeout_ms: int):
        pass
