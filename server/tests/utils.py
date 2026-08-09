import base64
import io

from PIL import Image


def make_test_image_data_url():
    img = Image.new("RGB", (64, 64), color=(200, 100, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/jpeg;base64,{b64}"
