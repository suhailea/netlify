const formData = require("form-data");
const Mailgun = require("mailgun.js");
const Airtable = require("airtable");

const sendThankYouEmail = async ({ email }) => {
  console.log("Sending the email");
  const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env;
  const mailgun = new Mailgun(formData).client({
    username: "api",
    key: apiKey,
  });

  const mailData = {
    from: `Stefan Judis stefan@${domain}`,
    to: 'suhailea@outlook.com',
    subject: "Thank you for your interest",
    text: "I'll come back to you asap!",
  };

  await mailgun.messages.create(domain, mailData);
};

const saveUser = async ({ name, email, message }) => {
  const { AT_API_KEY: apiKey, AT_BASE, AT_TABLE } = process.env;

  Airtable.configure({
    apiKey,
  });

  const base = Airtable.base(AT_BASE);
  const table = base(AT_TABLE);
  await table.create({ name, email, message });
};

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);

    await sendThankYouEmail(data);

    if (data.receiveUpdates) {
      await saveUser(data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Let's become serverless conductors!!!",
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed sending email" }),
    };
  }
};
