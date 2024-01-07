const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const echoProto = protoLoader.loadSync("./echo.proto");
const echoDefinition = grpc.loadPackageDefinition(echoProto);
const { echoPackage } = echoDefinition;

const SERVER_URL = "localhost:5000";

const client = new echoPackage.EchoService(
  SERVER_URL,
  grpc.credentials.createInsecure()
);

client.EchoUnary({ value: "welcome to grpc" }, (err, res) => {
  if (err) return console.log("Error: ", err.message);
  console.log("response: ", res);
});

const serverStream = client.EchoServerStream();

serverStream.on("data", (data) => {
  console.log(data);
});

serverStream.on("end", (err) => {
  console.log("error: " + err.message);
});

const echos = [{ value: "value1" }, { value: "value2" }, { value: "value3" }];

const clientStream = client.EchoClientStream({}, (err, res) => {});

for (let index = 0; index < echos.length; index++) {
  clientStream.write(echos[index]);
}

clientStream.on("data", (data) => {
  console.log("clientStream: ", data);
});

clientStream.on("end", (err) => {
  console.log("error: " + err.message);
});
