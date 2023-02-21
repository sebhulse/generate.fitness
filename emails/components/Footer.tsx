import React from "react";
import { MjmlSection, MjmlWrapper, MjmlColumn, MjmlText } from "mjml-react";
import Link from "./Link";
import { colors, fontSize, fontWeight } from "../theme";
import { EMAIL_PREFERENCES_URL } from "mailing-core";

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export default function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <>
      <MjmlWrapper backgroundColor={colors.gray800}>
        <MjmlSection paddingTop={24} paddingBottom={24} cssClass="gutter">
          <MjmlColumn padding={"16px 0"}>
            <MjmlText
              align="center"
              fontSize={fontSize.xs}
              color={colors.slate400}
              fontWeight={fontWeight.bold}
              textTransform="uppercase"
            >
              Help & Bugs
            </MjmlText>
            <MjmlText align="center" paddingBottom={16}>
              <Link
                color={colors.white}
                fontSize={fontSize.sm}
                href="mailto:hi@generate.fitness"
              >
                hi@generate.fitness
              </Link>
            </MjmlText>

            <MjmlText
              align="center"
              fontSize={fontSize.xs}
              color={colors.slate400}
              fontWeight={fontWeight.bold}
              textTransform="uppercase"
            >
              generate.fitness {new Date().getFullYear()}
            </MjmlText>
            <MjmlText align="center">
              <Link
                color={colors.white}
                fontSize={fontSize.sm}
                href="https://generate.fitness"
              >
                generate.fitness
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
