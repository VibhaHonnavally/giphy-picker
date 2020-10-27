import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';

const AlertComponent = ({copySuccess, apiResponseState}) => {
  return (
    <div>
      <Collapse in={copySuccess}>
        <Alert variant="filled" severity="success" style={{ position: 'fixed', top: 80, left: 20, width: 500, zIndex: 1 }}>
          Copied Url...
          </Alert>
      </Collapse>
      <Collapse in={!apiResponseState}>
        <Alert variant="filled" severity="error" style={{ position: 'fixed', top: 80, left: 20, width: 500, zIndex: 1 }}>
          API rate limit exceeded!
          </Alert>
      </Collapse>
    </div>
  )
}

export default AlertComponent;