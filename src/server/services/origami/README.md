# Origami service boundary

Future Origami access belongs in this directory and must run on the server only.

- UI components and client code must never import an Origami client.
- Route handlers and server actions may call a service exposed from this directory.
- Transport details, credentials, mapping, and error normalization stay behind this boundary.
- No Origami client or credentials are configured during project initialization.
