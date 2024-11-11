import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: "http://localhost:8000",
});

const main = async () => {
  //   const response = await client.createCollection({ name: "data-test" });
  await client.api
    .createTenant({ name: "Usama" })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  //   console.log(response);
};

main();
