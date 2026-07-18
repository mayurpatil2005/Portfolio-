import http.server
import socketserver
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Normalize path separators
        normalized_path = path.replace('\\', '/')
        # If the path starts with /MayurPortfolio, strip it to serve from the local directory
        if normalized_path.startswith('/MayurPortfolio'):
            remainder = normalized_path[len('/MayurPortfolio'):]
            if not remainder or remainder == '/':
                remainder = '/index.html'
            path = remainder
        return super().translate_path(path)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

# Allow port reuse to prevent address-already-in-use errors
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
    print(f"Serving MayurPortfolio at http://localhost:{PORT}/MayurPortfolio/")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
        sys.exit(0)
