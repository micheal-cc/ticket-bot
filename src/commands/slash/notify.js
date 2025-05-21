const { SlashCommand } = require('@eartharoid/dbf');
const {
	ApplicationCommandOptionType,
	EmbedBuilder,
	PermissionsBitField,
} = require('discord.js');

module.exports = class NotifySlashCommand extends SlashCommand {
	constructor(client, options) {
		const name = 'notify';
		super(client, {
			...options,
			description: 'Notify a user about this ticket.',
			descriptionLocalizations: client.i18n.getAllMessages(`commands.slash.${name}.description`),
			dmPermission: false,
			name,
			nameLocalizations: client.i18n.getAllMessages(`commands.slash.${name}.name`),
			options: [
				{
					name: 'user',
					description: 'User to notify',
					type: ApplicationCommandOptionType.User,
					required: true,
					descriptionLocalizations: client.i18n.getAllMessages(`commands.slash.${name}.options.user.description`),
					nameLocalizations: client.i18n.getAllMessages(`commands.slash.${name}.options.user.name`),
				},
			],
		});
	}

	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 */
	async run(interaction) {
		const client = this.client;
		await interaction.deferReply({ ephemeral: true });

		const allowedRole = 'SUPPORT ROLE-ID HERE';
		if (!interaction.member.roles.cache.has(allowedRole)) {
			return interaction.editReply({
				content: '❌ You do not have permission to use this command.',
			});
		}

		const user = interaction.options.getUser('user', true);

		const embed = new EmbedBuilder()
			.setTitle('📬 Ticket Notification')
			.setDescription(
				`Hey ${user}, you have been asked to be notified about the update in <#${interaction.channel.id}> by ${interaction.user}.`
			)
			.setColor('#1f74ff')
			.setTimestamp();

		try {
			await user.send({ embeds: [embed] });

			await interaction.editReply({
				content: `✅ Successfully notified ${user.tag} via DM.`,
			});
		} catch (err) {
			await interaction.editReply({
				content: `❌ Failed to send a DM to ${user.tag}. They might have DMs disabled.`,
			});
		}
	}
};
