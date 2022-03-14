var ws = require("ws");
const _ = require("lodash");
var LiveApi = require("binary-live-api").LiveApi;
var api = new LiveApi({ websocket: ws, appId: 29875 }); // Replace APP ID with your app id

async function main() {
  await api.authorize("c1J9JJhfZAJiPME");
  api.subscribeToBalance();
  api.events.on("balance", (res) => {
    const balance = res.balance;
  });
}
main().then(console.log).catch(console.error);
let proposal_id;
function tickStreamDemo() {
  api.events.on("tick", function (response) {
    let data = JSON.parse(JSON.stringify(response));
    let ticksNum = (Number(data.tick.ask) * 1000000) % 10000;

    let buyFunc = function () {
      let param = {};
      param.amount = 0.35;
      param.basis = "stake";
      param.contract_type = "CALL";
      param.currency = "USD";
      param.duration = 1;
      param.duration_unit = "t";
      param.symbol = "R_10";
      let max = 1;
      api
        .buyContractParams(param, max)
        .then((response, reject) => {
          //map what you need hereprobably:
          proposal_id = response.proposal;
        })
        .catch(console.error);
      console.log(`ID: ` + proposal_id);
    };
    buyFunc();
  });
  api.subscribeToTick("R_10");
}

tickStreamDemo();
