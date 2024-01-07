const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const echoProto = protoLoader.loadSync("./echo.proto");
const echoDefinition = grpc.loadPackageDefinition(echoProto);
const { echoPackage } = echoDefinition;

const server = new grpc.Server();

const SERVER_URL = "localhost:5000";

server.addService(echoPackage.EchoService.service, {
  EchoUnary: (call, callback) => {
    console.log("call", call.request);
    callback(null, { message: "received" });
  },

  EchoClientStream: (call, callback) => {
    const list = [];

    call.on("data", (data) => {
      console.log("Server response: ", data);
      list.push(data);
      call.write(data);
    });

    call.on("end", (err) => {
      console.log(err);
    });
  },

  EchoServerStream: (call, callback) => {
    for (let i = 0; i < 10; i++) {
      call.write({ value: i });
    }

    call.on("end", (err) => {
      console.log(err);
    });
  },

  EchoBidiStream: (call, callback) => {},
});

server.bindAsync(SERVER_URL, grpc.ServerCredentials.createInsecure(), () =>
  server.start()
);

console.log(`RUNNINT OVER ${SERVER_URL}`);
