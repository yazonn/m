const Discord = require('discord.js');
const client = new Discord.Client();
const ms = require('ms');

client.on('message', async message => {
  if(message.author.bot) return;
  let prefix = '$';

  let command = message.content.split(" ")[0].slice(prefix.length);
  let args = message.content.split(" ").slice(1);
  if(!message.content.toLowerCase().startsWith(prefix)) return;

  if(command == 'mute') {
    if(!args.join(' ')) return message.channel.send(`${prefix}mute @user <time>`)
    if(message.member.hasPermission('MANAGE_MESSAGES')) {
      if(message.channel.permissionsFor(message.guild.member(client.user)).has(['MANAGE_ROLES', 'MANAGE_CHANNELS'])) {
        let role = message.guild.roles.find(r => r.name == 'Muted');
        if(role) {
          let member = message.mentions.members.first();
          if(member) {
            let time = args[1];
            if(time) {
              member.addRole(role.id)
              setTimeout(function() {
                member.removeRole(role.id);
              }, ms(time));
              message.guild.channels.forEach(async channel => {
                channel.overwritePermissions(role, {
                  READ_MESSAGES: false,
                  SPEAK: false
                });
              });
              message.channel.send(`${member.user.username} muted!`)
              let log = message.guild.channels.find(c => c.name == 'mod-log')
              if(log) log.send(`**${message.author.tag}** (${message.author.id}) **Muted ${member.user.tag}** | **Time:** \`${time}\``);
            } else {
              return message.channel.send(`${prefix}mute @user <time>`)
            }
          } else {
            return message.channel.send(`${prefix}mute @user <time>`)
          }
        } else {
          try {
            message.guild.createRole({
              name: 'Muted',
              color: '#00ff00',
              hoist: false
            }, 'To mute members.').then(r => {
              role = r;
              message.guild.channels.forEach(async channel => {
                channel.overwritePermissions(r, {
                  READ_MESSAGES: false,
                  SPEAK: false
                });
              });
            });
          } catch(e) {
            console.error(e);
          }
        }
      } else {
        return message.channel.send(`:x: I need \`MANAGE_ROLES\` & \`MANAGE_CHANNELS\` permission to run this command!`)
      }
    } else {
      return message.channel.send(`:x: You need \`MANAGE_MESSAGES\` permission to run this command!`)
    }
  }
});

client.login("token");