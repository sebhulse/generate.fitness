import React from "react";
import { MjmlColumn, MjmlGroup, MjmlSection, MjmlWrapper } from "mjml-react";
import Text from "./Text";
import Link from "./Link";
import { colors, fontSize, lineHeight, fontWeight } from "../theme";

export default function Header() {
  return (
    <MjmlWrapper padding="40px 0 64px" backgroundColor={colors.black}>
      <MjmlSection cssClass="gutter">
        <MjmlGroup>
          <MjmlColumn width="100%">
            <Text align="left">
              <Link
                color={colors.white}
                fontSize={fontSize.xl}
                fontWeight={fontWeight.bold}
                href="https://mailing.run"
                textDecoration="none"
              >
                generate.fitness
              </Link>
            </Text>
          </MjmlColumn>
          <MjmlColumn width="58%">
            <Text
              align="right"
              fontSize={fontSize.xs}
              lineHeight={lineHeight.tight}
              fontWeight={fontWeight.bold}
            ></Text>
          </MjmlColumn>
        </MjmlGroup>
      </MjmlSection>
    </MjmlWrapper>
  );
}
