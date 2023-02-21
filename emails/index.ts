import { buildSendMail } from "mailing-core";
import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
  ? process.env.AWS_ACCESS_KEY_ID
  : "";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
  ? process.env.AWS_SECRET_ACCESS_KEY
  : "";

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-west-2",
  credentials: {
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
  },
});

const transport = nodemailer.createTransport({
  SES: { ses, aws },
});

const sendMail = buildSendMail({
  transport,
  defaultFrom: "hi@generate.fitness",
  configPath: "../mailing.config.json",
});

export default sendMail;
