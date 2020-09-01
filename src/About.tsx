import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./About.module.css";

type PropTypes = {
  url: string;
};

const About = ({ url }: PropTypes) => {
  return (
    <main className="pb-5">
      <Container>
        <div className={styles.aboutContent}>
          <p>
            The information provided by this website is based on a{" "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              public Github repository
            </a>{" "}
            and collected by Gentics.
          </p>
          <p>
            We are the company behind the headless CMS Gentics Mesh, so it's
            hard to call us unbiased - please take all information with a grain
            of salt. However, we try to collect facts only here - if you
            disagree with any of the information shown, please create pull
            request!
          </p>
        </div>
        <h2>Imprint</h2>
        <div className={styles.imprint}>
          <pre>
            {`
            APA-IT Informations Technologie GmbH
            Laimgrubengasse 10
            1060 Vienna
            Austria
            Tel.: +43 1 36060-0
            Fax: +43 1 36060-6099
            E-Mail: it@apa.at
            Commercial register number: 195806a
            Commercial register court: Handelsgericht Wien
            VAT ID number: ATU53122400
            Data registry number: 4012664
            Member of the Austrian Federal Economic Chamber
            Legal form: Limited liability company
            © APA - Austria Press Agency eG. All rights reserved.

            APA is a registered Austrian trademark and a European Community trademark.
            `}
          </pre>
          <sub>
            This website uses Google Analytics, a web analytic service provided
            by Google Inc. ("Google"). Google Analytics uses so-called
            "cookies", which are text files that are stored on your computer to
            enable an analysis of the way you use this website. The information
            generated by the cookie concerning your use of this website
            (including your IP address) is transmitted to a Google server in the
            USA and stored there. Google will use this information to analyse
            your use of this website, to compile reports on website activities
            for website operators and to provide additional services associated
            with the website and internet use. If necessary, Google will also
            pass this information on to third parties to the extent it is
            prescribed by law or to the extent such third parties process the
            data on Google's behalf. Under no circumstances will Google bring
            your IP address into contact with other Google data. You can prevent
            the installation of cookies through the appropriate configuration of
            your browser software; however, we would like to point out that in
            this case you will not be able to take full advantage of all of this
            website's functions. By using this website you consent to the
            processing of the data Google gathers about you in the manner and
            for the purpose stated above.
          </sub>
        </div>
      </Container>
    </main>
  );
};

export default About;
