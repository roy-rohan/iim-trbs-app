import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import Loader from "../../assets/images/loader.gif";
import axios from "../../axios-iim";
import * as actions from "../../store/actions/index";
import * as cssClasses from "./Strategizer.module.css";

const styles = (theme) => ({
  table: {
    minWidth: 650,
  },
});

class Strategizer extends Component {
  state = {
    data: null,
    dataLoading: true,
  };

  componentDidMount() {
    axios
      .post(
        "/strategizer/read.php",
        JSON.stringify({
          filters: [],
          filterOp: "",
          sort: [
            {
              field_name: "score",
              op: "DESC",
            },
          ],
        })
      )
      .then((response) => {
        this.setState({ data: response.data, dataLoading: false });
      })
      .catch((error) => {
        this.setState({ dataLoading: false });
        this.props.onSendMessage("Could not fetch strategizer data. ", "error");
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={cssClasses.Strategizer}>
        <h1 className={cssClasses.StrategizerHeader}>
          Campus Strategizer Leaderboard
        </h1>
        {this.state.data ? (
          <div className={cssClasses.Content}>
            <div className={cssClasses.WeeklyLeaderboard}>
              <h1 className={cssClasses.BoardHeader}>Weekly Leaderboard</h1>
              <TableContainer
                component={Paper}
                className={cssClasses.TableContainer}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead className={cssClasses.TableHead}>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell align="right">Name</TableCell>
                      <TableCell align="center">College</TableCell>
                      <TableCell align="right">Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.data
                      .filter((row) => row.type.toUpperCase() === "WEEKLY")
                      .map((row, index) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell align="right">{row.name}</TableCell>
                          <TableCell align="center">{row.college}</TableCell>
                          <TableCell align="right">{row.score}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className={cssClasses.OverallLeaderboard}>
              {" "}
              <h1 className={cssClasses.BoardHeader}>Overall Leaderboard</h1>
              <TableContainer
                component={Paper}
                className={cssClasses.TableContainer}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead className={cssClasses.TableHead}>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell align="right">Name</TableCell>
                      <TableCell align="center">College</TableCell>
                      <TableCell align="right">Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.data
                      .filter((row) => row.type.toUpperCase() === "OVERALL")
                      .map((row, index) => (
                        <TableRow key={row.name}>
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell align="right">{row.name}</TableCell>
                          <TableCell align="center">{row.college}</TableCell>
                          <TableCell align="right">{row.score}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        ) : this.state.dataLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <img style={{ width: "150px" }} src={Loader} alt="comming soon" />
          </div>
        ) : (
          <p>No data</p>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message, type) =>
      dispatch(actions.sendMessage(message, type)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Strategizer));
