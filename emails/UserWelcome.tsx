import React from "react";
import { MjmlColumn, MjmlSection, MjmlSpacer, MjmlWrapper } from "mjml-react";
import BaseLayout from "./components/BaseLayout";
import Button from "./components/Button";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Header from "./components/Header";
import Text from "./components/Text";
import { fontSize, colors, spacing, fontFamily, screens } from "./theme";

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
};

const UserWelcome = ({ includeUnsubscribe, firstName }: WelcomeProps) => {
  return (
    <BaseLayout width={600} style={welcomeStyle}>
      <Header />
      <MjmlWrapper backgroundColor={colors.black}>
        <MjmlSection paddingBottom={spacing.s11} cssClass="gutter">
          <MjmlColumn>
            <Heading maxWidth={420} cssClass="h1">
              {`${
                firstName
                  ? `Welcome, ${
                      firstName.charAt(0).toUpperCase() + firstName.slice(1)
                    }`
                  : `Welcome`
              }`}
            </Heading>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection paddingBottom={spacing.s11} cssClass="gutter">
          <MjmlColumn>
            <Heading cssClass="h2" paddingBottom={spacing.s6}>
              It&apos;s time to start moving!
            </Heading>
            <Text
              cssClass="p"
              fontSize={fontSize.md}
              paddingBottom={spacing.s7}
            >
              Fitness.live allows you to inspire and customise your fitness
              training plans and workouts to help you stay on track. Visit your
              dashboard to get started.
            </Text>

            <Button
              href="https://github.com/sofn-xyz/mailing-templates"
              backgroundColor={colors.green300}
              align="left"
              cssClass="sm-hidden"
            >
              Let&apos;s go
            </Button>
            <MjmlSpacer height={spacing.s3} cssClass="lg-hidden" />
            <Button
              href="https://github.com/sofn-xyz/mailing-templates"
              backgroundColor={colors.green300}
              align="right"
              cssClass="lg-hidden"
            >
              Let&apos;s go
            </Button>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <Footer includeUnsubscribe={includeUnsubscribe} />
    </BaseLayout>
  );
};
UserWelcome.subject = "Welcome to fitness.liveㅤ";
export default UserWelcome;
