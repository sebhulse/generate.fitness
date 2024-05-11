import React from "react";
import {
  MjmlColumn,
  MjmlSection,
  MjmlSpacer,
  MjmlWrapper,
  MjmlText,
} from "mjml-react";
import BaseLayout from "./components/BaseLayout";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Header from "./components/Header";
import Text from "./components/Text";
import { fontSize, colors, spacing, screens } from "./theme";

const welcomeStyle = `
  .h1 > * {
    font-size: 56px !important;
  }
  .h2 > * {
    font-size: ${fontSize.lg}px !important;
  }
  .p > * {
    font-size: ${fontSize.base}px !important;
  }

  @media (min-width:${screens.xs}) {
    .h1 > * {
      font-size: 84px !important;
    }
    .h2 > * {
      font-size: ${fontSize.xxl}px !important;
    }
    .p > * {
      font-size: ${fontSize.md}px !important;
    }
  }
`;

type WelcomeProps = {
  firstName?: string;
  includeUnsubscribe?: boolean;
  url: string;
};

const VerifyEmail = ({ includeUnsubscribe, firstName, url }: WelcomeProps) => {
  return (
    <BaseLayout width={600} style={welcomeStyle}>
      <Header />
      <MjmlWrapper backgroundColor={colors.black}>
        <MjmlSection paddingBottom={spacing.s11} cssClass="gutter">
          <MjmlColumn>
            <Heading maxWidth={420} cssClass="h1">
              {`${
                firstName
                  ? `Hi, ${
                      firstName.charAt(0).toUpperCase() + firstName.slice(1)
                    }`
                  : `Hi`
              }`}
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingBottom={spacing.s11} cssClass="gutter">
          <MjmlColumn>
            <Heading cssClass="h2" paddingBottom={spacing.s6}>
              Verify your email address
            </Heading>
            <Text
              cssClass="p"
              fontSize={fontSize.md}
              paddingBottom={spacing.s7}
            >
              Please follow this magic link to verify your email address and
              sign in to generate.fitness:
            </Text>
            <MjmlSpacer height={spacing.s3} cssClass="lg-hidden" />
            <MjmlText>
              <a href={url} target="_blank" rel="noreferrer">
                {url}
              </a>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer includeUnsubscribe={includeUnsubscribe} />
    </BaseLayout>
  );
};
export default VerifyEmail;
