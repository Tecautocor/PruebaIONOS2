import axios from "axios";
import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  let start = Date.now();

  if (req.method === "GET") {
    let page = 1;

    try {
      const responseToken = await axios({
        method: "POST",
        url: `https://api.pilotsolution.net/v1/users/auth.php`,
        params: { username: "jsalcedo@autocor.com.ec", password: "12345" },
      });

      let tokenNew = responseToken.data.result.entitydata;
      if (!tokenNew) {
        console.log("Couldn't get the token");
        return res.status(404).end();
      }
      console.log('tokenNew: ', tokenNew)

      const data = [];
      let leftRemaining = 0;

      do {
        const response = await axios({
          method: "POST",
          url: `https://api.pilotsolution.net/v1/stock/list.php`,
          data: {
            data: {
              filters: [
                {
                  field: "availability_status_code",
                  operation: "=",
                  value: "1",
                },
              ],
              sort: [
                {
                  field: "created",
                  order: "DESC",
                },
              ],
              show_media: true,
              limit: 100,
              page: page,
            },
            header: {
              FlowName: "stock_images_list",
              SequenceId: 1,
              TimeStamp: 1248377,
              TrackingId: "55A6BCD4-0857-4A86-85FB-09A228B641B4",
              access_token: tokenNew,
            },
          },
        });

        leftRemaining = response.data.result.aditional_data.rows_remaining;
        page++;

        response.data.result.entitydata.forEach((item) =>
          data.push({
            id: item.id,
            media:
              item.media.length > 0
                ? item.media.filter((photo) => photo.size === "desktop")[0]
                    .full_path
                : null,
            brand: item.brand,
            model: item.model,
            prices: Number(item.prices[0].value) + 0,
            year: Number(item.year) || 0,
            owner: item.factory.status.toUpperCase() === "SI" ? 1 : 0,
            home: item.factory.request_number.toUpperCase() === "SI" ? 1 : 0,
            type: item.saving_plan.saving_plan_group.toUpperCase(),
            odometer: Number(item.odometer) + 0,
            business_channel: item.business_channel,
            location: item.owner_branch_code?.name || "No disponible",
            // location: item.location,
          })
        );
      } while (leftRemaining > 0);

      if (data.length === 0) {
        console.log("Couldn't fetch Pilot data");
        return res.status(404).end();
      }

      const clean = await db.$executeRawUnsafe(`TRUNCATE Vehicle`);
      if (clean === 0) {
        const responseLoad = await db.vehicle.createMany({
          data,
        });
      } else {
        console.log("Couldn't clean the table");
        return res.status(404).end();
      }
      let timeTaken = Date.now() - start;
      return res
        .status(200)
        .json(`Data loaded | ${data.length} records | Time ${timeTaken}ms`);
    } catch (err) {
      console.log(err);
      console.log("Couldn't get Pilot data");
      return res.status(404).end();
    }
  }
  console.log("Wrong API call");
  return res.status(404).end();
}

export default handler;
