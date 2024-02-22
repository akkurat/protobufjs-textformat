
Parser for TextFormat protobuf messages.

# Usage
```javascript
const sut = require('protobufjs-textformat')
const ProtoBuf = require('protobufjs')
const fqn = 'google.fonts_public.FamilyProto';
// load protobuf definition
const root = await (new ProtoBuf.Root()).load('fonts_public.proto', { keepCase: true })

// load text based protobuf data
const input = fs.readFileSync('METADATA.pb', 'utf-8');
const result = sut.parse(root, fqn, input), message = result.message;

console.log(message)

```
For usage of protobufjs itself see https://github.com/protobufjs/protobuf.js?tab=readme-ov-file#examples 