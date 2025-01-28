import { Alert, Button, Flex, Input, Space, theme, Tooltip, Typography } from "antd";
import { CopyFilled, LockFilled, UndoOutlined, UnlockFilled } from "@ant-design/icons";
import { decrypt, encrypt } from "./utils";
import { useEffect, useState } from "react";

const { Title } = Typography;

function App() {
  const [password, setPassword] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [disableCopy, setDisableCopy] = useState(true);
  const [copied, setCopied] = useState(false);
  const [lastAction, setLastAction] = useState('');

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();

  console.log('colorBgContainer', colorBgContainer)

  useEffect(() => {
    if (result) {
      setDisableCopy(false)
    }
  }, [result]);

  const handleEncrypt = () => {
    setSuccessMsg('')
    if (!password || !value) {
      setError('Password and value are required')
      return
    }
    setResult(encrypt(value, password))
    setSuccessMsg('Successfully encrypted')
    setValue('')
    setError('')
    setLastAction('encrypt')
  }

  const handleDecrypt = () => {
    setSuccessMsg('')
    if (!password || !value) {
      setError('Password and value are required')
      return
    }
    const decrypted = decrypt(value, password)

    if (decrypted) {
      setResult(decrypted)
      setSuccessMsg(decrypted !== result ? 'Successfully decrypted' : 'Already decrypted')
      setValue('')
      setError('')
    } else {
      setError('Invalid password or value')
    }
    setLastAction('decrypt')
  }

  const handleReset = () => {
    setPassword('')
    setValue('')
    setResult('')
    setError('')
    setSuccessMsg('')
    setDisableCopy(true)
  }

  const handleCopy = async () => {
    if (result) {
      const resultArea = document.getElementById("result") as HTMLInputElement;
      resultArea.focus();
      resultArea.select();
      document.execCommand('copy');
      // await navigator.clipboard.writeText(result)
      setCopied(true)
      setDisableCopy(true)
      setTimeout(() => {
        setCopied(false)
        setDisableCopy(false)
        if (lastAction === 'decrypt') {
          setResult('')
          setSuccessMsg('')
        }
      }, 800)
    }
  }

  return (
    <div style={{ background: colorBgContainer, height: '100vh' }}>
      <Flex style={{
        width: '100%'
      }} justify={'center'} align={'top'}>
        <Space size={'middle'} direction="vertical" style={{
          width: '100%',
          padding: '0 2rem 2rem'
        }}>
          <Space size={'middle'} style={{
            color: colorText,
          }}>
            <h1>Falcrypt</h1>
            <h4>made for Notion</h4>
          </Space>
          <div>
            <Title level={5}>PIN</Title>
            <Space size={'middle'}>
              <div style={{
                width: '15rem'
              }}>
                <Input.Password
                  placeholder="PIN"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="default"
                onClick={() => handleReset()}
                disabled={(!value && !result && !password)}
                icon={<UndoOutlined />}
              >
                Reset
              </Button>
            </Space>
          </div>
          <Input
            placeholder="Value to encrypt/decrypt"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <Space size={'middle'}>
            <Button
              type="default"
              onClick={() => handleEncrypt()}
              disabled={(!password || !value)}
              icon={<LockFilled/>}
            >Encrypt</Button>
            <Button
              type="default"
              onClick={() => handleDecrypt()}
              disabled={(!password || !value)}
              icon={<UnlockFilled/>}
            >Decrypt</Button>
          </Space>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Result" readOnly value={result} variant={"filled"} id={'result'}/>
            <Tooltip placement="top" title={'Copied!'} arrow open={copied}>
              <Button
                type="default"
                icon={<CopyFilled />}
                onClick={() => handleCopy()}
                disabled={!result || disableCopy}
              >Copy</Button>
            </Tooltip>
          </Space.Compact>
          {successMsg && <Alert message={successMsg} type="info"/>}
          {error && <Alert message={error} type="error"/>}
        </Space>
      </Flex>
    </div>
  )
}

export default App
