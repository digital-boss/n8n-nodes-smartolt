# n8n-nodes-smartolt

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

# If you have n8n installed: Install custom nodes module

Install it to the n8n root folder. This is the node_modules folder on the same level of n8n and n8n-core. This differs when you used the -g flag on n8n initial installation. From there do:
```
npm install @digital-boss/n8n-nodes-smartolt
```

# IFresh install n8n

Navigate to desired folder, create a package json and install n8n like so:
```
cd /var/www/vhosts/

mkdir my-n8n && cd my-n8n

npm init --yes

npm install n8n

npm install @digital-boss/n8n-nodes-smartolt
```

# Start n8n

Directly:
```
n8n
```
Plesk or C-Panel:
```
node /var/www/vhosts/n8n/bin/n8n
```

[comment]: <> (# Latest functionality)

# Contribution

To make this node even better, please let us know, [how you use it](mailto:info@digital-north-consulting.com). Commits are always welcome. 

# Issues

If you have any issues, please [let us know on GitHub](https://github.com/digital-boss/n8n-nodes-smartolt/issues).

# About

Special thanks to [N8n nodemation](https://n8n.io) workflow automation by Jan Oberhauser.

Nodes by [digital-north-consulting.com](https://digital-north-consulting.com). For productive use and consulting on this, [contact us please](mailto:info@digital-north-consulting.com).

This node was updated with ❤️ by Valentina Lilova [valentina98](https://github.com/valentina98)

## License

[Apache 2.0 with Commons Clause](https://github.com/n8n-io/n8n/blob/master/packages/nodes-base/LICENSE.md)


