export const sendNotification = async ({
  to,
  title,
  body,
}: {
  to: string | string[];
  title: string;
  body: string;
}) => {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    body: JSON.stringify({
      to,
      title,
      body,
    }),
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
  });
};
