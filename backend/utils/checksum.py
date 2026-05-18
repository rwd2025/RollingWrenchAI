import zlib

def calculate_crc32(binary_data: bytes) -> int:
    return zlib.crc32(binary_data) & 0xFFFFFFFF

def verify_checksum(binary_data: bytes, expected_crc: int) -> bool:
    actual_crc = calculate_crc32(binary_data)
    return actual_crc == expected_crc

def print_checksum_report(binary_data: bytes):
    crc = calculate_crc32(binary_data)
    print(f"[CHECKSUM] File Size: {len(binary_data)} bytes")
    print(f"[CHECKSUM] CRC32: {hex(crc)}")
    return crc
