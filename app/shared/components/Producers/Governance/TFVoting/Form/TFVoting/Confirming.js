// @flow
import React, { Component } from 'react';
import { Button, Divider, Icon, Segment, Table, Header, Message } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import GlobalButtonElevate from '../../../../../../containers/Global/Button/Elevate';
const { shell } = require('electron');

class GovernanceTFVotingFormTFVotingConfirming extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      walletUnLockRequested: false
    };
  }
  onConfirm = (e) => {
    const {
      onConfirm
    } = this.props;

    onConfirm();
    e.preventDefault();
    return false;
  }
  unlockWallet = (password = false) => {
    const { actions, system } = this.props;

    this.setState({walletUnLockRequested: true});

    actions.unlockWallet(password);
    system.GOVERNANCE_ACCEPTNOMINATION_LAST_ERROR = null;
  }
  openLink = (link) => {
    const { settings } = this.props;
    if (link.match(/^\/(ip(f|n)s)\/((\w+).*)/)) {
      shell.openExternal(settings.ipfsProtocol + "://" + settings.ipfsNode + "/" + link);
    } else {
      shell.openExternal(link);
    }
  }
  render() {
    const { 
      walletUnLockRequested 
    } = this.state;
    const {
      creds_ipfs_url,
      fileInfo,
      ipfsHash,
      onBack,
      onClose,
      settings,
      system,
      t,
      tfvoting,
      validate,
      wallet
    } = this.props;
    let ipfsSuccess = (ipfsHash && ipfsHash.length > 0);
    let lastError = system.GOVERNANCE_ACCEPTNOMINATION_LAST_ERROR;

    if (walletUnLockRequested && validate.WALLET_PASSWORD === 'SUCCESS'){
      lastError = '';
      ipfsSuccess = false;
      this.setState({ walletUnLockRequested: false });
    }
    return (
      <Segment basic clearing vertical>
        <Header block size="large">
          <Icon name="circle info" />
          <Header.Content>
            <Header.Subheader>
              Thanks for accepting your nomination <strong>{settings.account}</strong>! The role as a Telos Foundation Board Member is critical to the future success of the network. 
              If elected, we hope you're ready to help us change the world! Please review the information below - once submitted, it cannot be modified. 

              Good luck!
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                More Info:
              </Table.Cell>
              <Table.Cell>
                Committing the contents of <strong>{fileInfo.name}</strong> to IPFS.
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider style={{ marginTop: '40px' }} />

        {(lastError && system.GOVERNANCE_ACCEPTNOMINATION !== 'SUCCESS')
          ? (
            <Message negative size="tiny">
              {(lastError.code)
                ? (
                  <div>
                    <Message.Header>
                      {lastError.code}: {lastError.name}
                    </Message.Header>
                    <code>{lastError.message}</code>
                  </div>
                )
                : (
                  <div>
                    <Message.Header>
                      {t(['producer_voter_preview_error_title'])}
                    </Message.Header>
                    <code>{new String(lastError)}</code>
                  </div>
                )
              }
            </Message>
          )
          : ''
        }

        {(lastError && lastError.message && lastError.message.indexOf('keyProvider') !== -1) ?
          <GlobalButtonElevate
            onSuccess={(password) => this.unlockWallet(password)}
            settings={settings}
            trigger={(
              <Button
                color="red"
                content="Unlock Wallet"
                icon="unlock"
                style={{ marginBottom: '10px' }}
              />
            )}
            validate={validate}
            wallet={wallet}
          />
          : ''}

        { (ipfsSuccess === true && system.GOVERNANCE_ACCEPTNOMINATION === 'SUCCESS') ?
        <div>
            <Message
            positive
            content={(
              <p>
                <a
                  onClick={() => this.openLink(creds_ipfs_url)}
                  role="link"
                  style={{ cursor: 'pointer', fontSize:'10pt' }}
                  tabIndex={0}
                >{creds_ipfs_url}
                </a>
              </p>
            )}
            icon="inbox"
            info
            header="More Info Details Submitted to IPFS"
          />
          <Button
            onClick={onClose}
            floated="left">
            <Icon name="x" /> {t('close')}
          </Button>
        </div>
        :
        <div>
        <Button
          color="green"
          floated="right"
          onClick={this.onConfirm}
          content='Confirm My Nomination'
          loading={system.GOVERNANCE_ACCEPTNOMINATION === 'PENDING'}
        />
        <Button
          onClick={onBack}
          floated="left">
          <Icon name="arrow left" /> Go Back
        </Button>
        </div>
        }
      </Segment>
    );
  }
}

export default translate('producers')(GovernanceTFVotingFormTFVotingConfirming);
