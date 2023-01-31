import React from "react";
import {
  MjmlSection,
  MjmlWrapper,
  MjmlColumn,
  MjmlText,
  MjmlImage,
  MjmlGroup,
} from "mjml-react";
import Link from "./Link";
import { colors, fontSize, fontWeight } from "../theme";
import { EMAIL_PREFERENCES_URL } from "mailing-core";

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export default function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <>
      <MjmlWrapper
        backgroundColor={colors.gray800}
        borderBottom={`2px solid ${colors.black}`}
      >
        <MjmlSection>
          <MjmlColumn
            padding={"30px 0"}
            borderRight={`2px solid ${colors.black}`}
          >
            <MjmlText
              align="center"
              fontSize={fontSize.xs}
              color={colors.slate400}
              fontWeight={fontWeight.bold}
              paddingBottom={8}
              textTransform="uppercase"
            >
              Help & Bugs
            </MjmlText>
            <MjmlText align="center">
              <Link
                color={colors.white}
                fontSize={fontSize.sm}
                href="mailto:hi@sebhulse.com"
              >
                hi@sebhulse.com
              </Link>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>

      <MjmlWrapper backgroundColor={colors.gray800}>
        <MjmlSection paddingTop={32} paddingBottom={24} cssClass="gutter">
          <MjmlColumn>
            <MjmlText
              align="center"
              fontSize={fontSize.xs}
              color={colors.slate400}
              fontWeight={fontWeight.bold}
              textTransform="uppercase"
            >
              Fitness.live {new Date().getFullYear()}
            </MjmlText>
            <MjmlText align="center">
              <Link
                color={colors.white}
                fontSize={fontSize.sm}
                href="https://fitness.live"
              >
                fitness.live
              </Link>
            </MjmlText>

            {includeUnsubscribe && (
              <MjmlText
                align="center"
                fontSize={fontSize.xs}
                color={colors.slate400}
                paddingTop={12}
              >
                You&rsquo;re receiving this email because you asked for
                occasional updates about Mailing. If you don&rsquo;t want to
                receive these in the future, you can{" "}
                <Link
                  color={colors.slate400}
                  textDecoration="underline"
                  href={EMAIL_PREFERENCES_URL}
                >
                  unsubscribe.
                </Link>
              </MjmlText>
            )}
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </>
  );
}
