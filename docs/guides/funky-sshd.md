# The Funky SSHD

> *Or alternatively, the "Cha Cha Slide" SSHD!* ;3

## Directory Structure Setup

Create the two environment directories:

```bash
mkdir -p ~/ssh_gateway ~/ssh_target
```

## Key Generation

Generate host keys and the gateway jump key:

```bash
# Gateway host key
ssh-keygen -t ed25519 -f ~/ssh_gateway/ssh_host_ed25519_key -N ""

# Gateway client key (for jumping to target)
ssh-keygen -t ed25519 -f ~/ssh_gateway/id_ed25519 -N ""

# Target host key
ssh-keygen -t ed25519 -f ~/ssh_target/ssh_host_ed25519_key -N ""
```

## User Authorization Setup

Add the gateway's public key (`~/ssh_gateway/id_ed25519.pub`) into the testuser account's authorized keys file:

```bash
mkdir -p ~testuser/.ssh
cat ~/ssh_gateway/id_ed25519.pub >> ~testuser/.ssh/authorized_keys
chmod 700 ~testuser/.ssh
chmod 600 ~testuser/.ssh/authorized_keys
chown -R testuser:testuser ~testuser/.ssh
```

## Gateway Configuration (`~/ssh_gateway/sshd_config`)

Create `~/ssh_gateway/sshd_config` with the following contents:

```properties
Port 22
ListenAddress 127.0.0.1
HostKey /home/aundrem/ssh_gateway/ssh_host_ed25519_key
PidFile /home/aundrem/ssh_gateway/sshd.pid

PermitRootLogin yes
PasswordAuthentication yes

Match User root
		ForceCommand ssh -t -i /home/aundrem/ssh_gateway/id_ed25519 -o StrictHostKeyChecking=no testuser@127.0.0.2 -p 23
```

## Target Configuration (`~/ssh_target/sshd_config`)

Create `~/ssh_target/sshd_config` with the following contents:

```properties
Port 23
ListenAddress 127.0.0.2
HostKey ~/ssh_target/ssh_host_ed25519_key
PidFile ~/home/aundrem/ssh_target/sshd.pid

PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

## Testing

```bash
# Kill any running instances:
sudo pkill -F ~/ssh_gateway/sshd.pid
sudo pkill -F ~/ssh_target/sshd.pid

# Start the target daemon first:
sudo /usr/sbin/sshd -f ~/ssh_target/sshd_config

# Start the gateway daemon:
sudo /usr/sbin/sshd -f ~/ssh_gateway/sshd_config

# Test the connection:
ssh root@127.0.0.1
```
