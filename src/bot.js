const {
  ActivityHandler,
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  createBotFrameworkAuthenticationFromConfiguration,
  MessageFactory,
} = require('botbuilder');

class Bot extends ActivityHandler {
  constructor(settings = {}) {
    super();
    this.settings = settings;
    this.createAdapter();
    this.registerEvents();
  }

  createAdapter() {
    const credFactory = new ConfigurationServiceClientCredentialFactory({
      MicrosoftAppId: this.settings.appId || process.env.APP_ID,
      MicrosoftAppPassword: this.settings.appPassword || process.env.APP_PASSWORD,
      MicrosoftAppType: this.settings.appType || process.env.APP_TYPE,
      MicrosoftAppTenantId: this.settings.appTenantId || process.env.APP_TENANT_ID,
    });
    
    const botAuth = createBotFrameworkAuthenticationFromConfiguration(null, credFactory);
    this.adapter = new CloudAdapter(botAuth);
    this.adapter.onTurnError = async (context, error) => {
      console.error(`\n [onTurnError] unhandled error: ${error}`);
      await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
      );
      await context.sendActivity('The bot encountered an error or bug.');
    };
  }

  registerEvents() {
    this.onMessage(async (context, next) => {
      const replyText = `Echo: ${ context.activity.text }`;
      await context.sendActivity(MessageFactory.text(replyText, replyText));
      await next();
    });

    this.onMembersAdded(async (conversationContext, next) => {
    });
    this.onMembersRemoved(async (conversationContext, next) => {
    });
  }

  async process(req, res) {
    await this.adapter.process(req, res, (context) => this.run(context));
  }
}

module.exports = {
  Bot,
}
