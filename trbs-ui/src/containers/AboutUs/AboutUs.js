import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Modal from "../../components/UI/Modal/Modal";
import classes from "./AboutUs.module.css";
import VideoImage from "../../assets/images/home/AboutUs.PNG";
import parse from "html-react-parser";
import axios from "../../axios-iim";

const AboutUs = (props) => {
  const [showVideo, setShowVideo] = useState(false);
  const [aboutPageContent, setAboutPageContent] = useState(null);

  useEffect(() => {
    axios
      .post("/content/about-page/read-single.php", JSON.stringify({}))
      .then((res) => {
        setAboutPageContent(res.data ? res.data : null);
      });
  }, []);

  return (
    <div className={classes.AboutUs}>
      <div className={classes.PageHeaderWrapper}>
        <h1 className={classes.PageHeading}>About Us</h1>
      </div>
      <div className={classes.ContentWrapper}>
        <div className={classes.SectionOne}>
          <div className={classes.TextSection}>
            <h1>About The Red Brick Summit</h1>
            {/* <p>
              IIM Ahmedabad is internationally recognized as a premier B-School
              that has been the alma mater of many industry stalwarts. Over the
              last 58 years, the institute has conceptualized and executed
              events that can harness innovation and insights to redefine
              management in our country.
            </p>
            <p>
              The Indian Institute of Management, Ahmedabad is all set, once
              again, to host its biggest management symposium this year in a
              virtual format, on October 9th and October 10th 2021.
              Appropriately named the Red Brick Summit (TRBS), after the famous
              environs that have come to be associated with over 50 years of
              academic excellence, the symposium will be a potpourri of the
              erstwhile Big Four of IIMA – Insight, Confluence, Amaethon and
              ConneXions – that have been a mainstay of our institute's event
              calendar all these years. Pioneered in 2017, this is Asia's
              largest management symposium that attracts over 60,000
              participants every year.
            </p> */}
            {parse(
              aboutPageContent?.about
                ? aboutPageContent?.about
                : "<p>Loading...</p>"
            )}
          </div>
          <div className={classes.AboutVideo}>
            <img
              src={VideoImage}
              alt="about video"
              onClick={() => setShowVideo(true)}
            />
            <Modal show={showVideo} modalClosed={() => setShowVideo(false)}>
              <ReactPlayer
                width={"100%"}
                controls
                height={"80vh"}
                url={
                  aboutPageContent?.video_link
                    ? aboutPageContent.video_link
                    : "https://www.youtube.com/watch?v=0DBp_dwDSCk"
                }
                playing={showVideo}
              ></ReactPlayer>
              <div className={classes.CloseBtnWrapper}>
                <button
                  className={classes.CloseBtn}
                  onClick={() => setShowVideo(false)}
                >
                  Close
                </button>
              </div>
            </Modal>
          </div>
        </div>
        <div className={classes.EventSection}>
          <h1 className={classes.SectionHeader}>Events</h1>
          {/* <p>
            The Red Brick Summit was conceived to challenge today's youth to
            think beyond their imagination. Through a plethora of competitive
            events, TRBS provides a platform for innovation and pushes
            participants to flex their brains. Growing with a strong trajectory,
            this year, we have even greater number of competitive events,
            including international ventures. Witness the amalgamation of the
            best minds of this country at the epicenter of this brainstorming
            festival.
          </p> */}
          {parse(
            aboutPageContent?.event_desc
              ? aboutPageContent?.event_desc
              : "<p>Loading...</p>"
          )}
        </div>
        <div className={classes.WorkshopSection}>
          <h1 className={classes.SectionHeader}>Workshops</h1>
          {/* <p>
            Disruption and dynamism are the prime characteristic of every
            professional field in this century. As aspiring thinkers and future
            leaders, it is essential for our generation to possess the ability
            to mould themselves to continuously evolve in this environment. TRBS
            team is proud to present the workshop series for 2021 that would be
            conducted by some of the most renowned names across industries. Each
            workshop is strategized to ensure maximum interaction between the
            presenter and participants, encompassing a fascinating breadth of
            subject matter.
          </p>
          <p>
            In the previous years, the workshops were hosted by senior
            executives from companies such as Microsoft, Amazon, PepsiCo,
            Zerodha, Capgemini, Google, TATA Trusts, Nielsen, Reliance, Uber,
            and Mad Over Marketing. The sessions overarched a broad range of
            themes including product management, finance, digital innovation,
            advertising trends etc. Spread over the course of the festival,
            these workshops elevate the learning experience for all attendees
            and gives a chance to learn directly from the pundits.
          </p> */}
          {parse(
            aboutPageContent?.workshop_desc
              ? aboutPageContent?.workshop_desc
              : "<p>Loading...</p>"
          )}
        </div>
        <div className={classes.SpeakerSection}>
          <h1 className={classes.SectionHeader}>Speakers</h1>
          {/* <p>
            Pages of TRBS diaries are studded with names that have inspired
            millions of people in our country. We present you with a chance to
            witness the aura of corporate behemoths, parliamentary dignitaries,
            renowned journalists, and activists that are shaping our nation.
            Every year, we invite experts from varying fields to share their
            stories and enlighten us with their learnings.
          </p>
          <p>
            In 2020, some of the prominent speakers that graced the event
            included industry stalwarts such as Sir Martin Sorrell (Founder &
            Executive Chairman, S4 Capital Plc), Zarin Daruwala (CEO, Standard
            Chartered Bank, India), Mukesh Bansal (Co-founder, Myntra &
            Cure.fit), Shiv Khera (Author of the international bestseller ‘You
            Can Win’), and Sanjeev Bikhchandani (Founder, InfoEdge), to name a
            few.
          </p>
          <p>
            In 2019, the inaugural session was hosted by Mr. Srijan Pal Singh,
            OSD to Dr. Kalam & founder & CEO of Dr. A.P.J Abdul Kalam Centre.
            Sachin Bansal, founder & ex-CEO of Flipkart, enthralled a packed
            auditorium with his speech on his experience about entrepreneurial
            journey. In the same space, TRBS was graced by the presence of S.
            Gurumurthy, Other eminent personalities that took the stage include
            – Justice C. K. Thakker, Gaurav Ajmera, Dr. Hasmukh Adhia, Navin
            Gurnaney, Adil Zainulbhai, Raamdeo Agrawal, T. S. Bhattacharya, Dr.
            Hasit Joshipura, Chandra Balani, Shri Gaur Gopal Das.
          </p>
          <p>
            Watch out for this space as we reveal the guestlist for the sessions
            this fall!
          </p>
           */}
          {parse(
            aboutPageContent?.speaker_desc
              ? aboutPageContent?.speaker_desc
              : "<p>Loading...</p>"
          )}
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
