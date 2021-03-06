import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { UserClient } from 'common/user-clients';
import { Notifications } from '../../../../stores/notifications';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { getManageSubscriptionURL } from '../../../../utility';
import { LocaleLink } from '../../../locale-helpers';
import { InfoIcon, PenIcon, SettingsIcon } from '../../../ui/icons';
import {
  LabeledCheckbox,
  LabeledInput,
  LinkButton,
  Toggle,
} from '../../../ui/ui';

import './settings.css';

const Section = ({
  title,
  titleAction,
  className = '',
  children,
  ...props
}: {
  title: string;
  titleAction?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) => (
  <section className={'user-setting ' + className} {...props}>
    <div className="section-title">
      <h2>{title}</h2>
      {titleAction}
    </div>
    {children && <div className="section-body">{children}</div>}
  </section>
);

interface PropsFromState {
  account: UserClient;
  locale: string;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
  saveAccount: any;
}

interface Props extends LocalizationProps, PropsFromState, PropsFromDispatch {}

function Settings(props: Props) {
  const { account, addNotification, getString, locale, saveAccount } = props;
  const [isSubscribed, setIsSubscribed] = useState<boolean>(null);

  useEffect(() => {
    if (!account.basket_token) return;
    fetch(
      'https://basket.mozilla.org/news/lookup-user/?token=' +
        account.basket_token
    )
      .then(response => response.json())
      .then(body => setIsSubscribed(body.newsletters.includes('common-voice')));
  }, []);

  useEffect(() => {
    const { pathname, search } = location;
    if (search.includes('success=false')) {
      addNotification(
        <Localized id="email-already-used">
          <span />
        </Localized>,
        'error'
      );
      history.replaceState({}, null, pathname);
    } else if (search.includes('success=true')) {
      addNotification(
        <Localized id="profile-form-submit-saved">
          <span />
        </Localized>
      );
      history.replaceState({}, null, pathname);
    }
  }, []);

  return (
    <div>
      <Section title={getString('login-identity')} className="two-columns">
        <Localized id="email-input" attrs={{ label: true }}>
          <LabeledInput value={account.email} disabled />
        </Localized>

        <LinkButton
          outline
          className="edit-button"
          href={location.origin + '/login?change_email'}>
          <PenIcon />
          <Localized id="edit">
            <span />
          </Localized>
        </LinkButton>
      </Section>

      {account.basket_token && (
        <Section
          title={getString('email-subscriptions')}
          titleAction={
            <a
              className="manage-subscriptions"
              href={getManageSubscriptionURL(account)}
              target="__blank"
              rel="noopener noreferrer">
              <Localized id="manage-subscriptions">
                <span />
              </Localized>
              <SettingsIcon />
            </a>
          }>
          <div className="email-section">
            {isSubscribed == null ? (
              <div />
            ) : (
              <LabeledCheckbox
                disabled={true}
                checked={isSubscribed}
                label={
                  <Localized id="email-opt-in-info">
                    <span />
                  </Localized>
                }
              />
            )}
            <div className="privacy-and-terms">
              <InfoIcon />
              <div>
                <Localized
                  id="email-opt-in-privacy"
                  privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
                  <div />
                </Localized>
                <br />
                <Localized id="read-terms-q">
                  <LocaleLink to={URLS.TERMS} className="terms" blank />
                </Localized>
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section title={getString('contribution-experience')} className="box">
        <div>
          <Localized id="skip-submission-feedback">
            <h3 className="feedback-toggle-title" />
          </Localized>
          <Toggle
            offText="off"
            onText="on"
            defaultChecked={account.skip_submission_feedback}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              saveAccount({
                skip_submission_feedback: event.target.checked,
              })
            }
          />
          <Localized id="skip-submission-description">
            <p className="skip-submission-description" />
          </Localized>
          <Localized id="skip-submission-note">
            <p className="skip-submission-note" />
          </Localized>
        </div>

        <div className="images">
          <img
            className="hidden-sm-down"
            src={require('./submission-screenshot-lg.png')}
            alt="Submission Success Screenshot"
          />
          <img
            className="hidden-md-up"
            src={require('./submission-screenshot-xs.png')}
            alt="Submission Success Screenshot"
          />
        </div>
      </Section>
    </div>
  );
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ locale, user }: StateTree) => ({
    account: user.account,
    locale,
  }),
  {
    addNotification: Notifications.actions.addPill,
    saveAccount: User.actions.saveAccount,
  }
)(withLocalization(Settings));
