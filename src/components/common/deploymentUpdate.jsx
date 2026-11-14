import { Component } from "react";
import { withRouter } from "react-router-dom";
import { createDeploymentChecker } from "../../utils/deploymentUpdate";

class DeploymentUpdate extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV !== "production") return;
    this.checkDeployment = createDeploymentChecker();
    this.checkDeployment();
  }

  componentDidUpdate(previousProps) {
    if (this.checkDeployment && previousProps.location !== this.props.location) {
      this.checkDeployment();
    }
  }

  render() {
    return null;
  }
}

export default withRouter(DeploymentUpdate);
