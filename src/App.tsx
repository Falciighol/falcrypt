import { Alert, Button, Flex, Input, Space, theme, Tooltip, Typography } from 'antd'
import { CopyFilled, LockFilled, UndoOutlined, UnlockFilled } from '@ant-design/icons'
import { decrypt, encrypt } from './utils'
import { useEffect, useState } from 'react'

const { Text } = Typography

function App() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [lastAction, setLastAction] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [disableCopy, setDisableCopy] = useState(true)

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken()

  useEffect(() => {
    if (result) {
      setDisableCopy(false)
    }
  }, [result])

  const handleEncrypt = () => {
    setSuccessMsg('')
    if (!pin || !value) {
      setError('Password and value are required')
      return
    }
    setPin('')
    setValue('')
    setError('')
    setResult(encrypt(value, pin))
    setSuccessMsg('Successfully encrypted')
    setLastAction('encrypt')
  }

  const handleDecrypt = () => {
    setSuccessMsg('')
    if (!pin || !value) {
      setError('Password and value are required')
      return
    }
    const decrypted = decrypt(value, pin)

    if (decrypted) {
      setPin('')
      setValue('')
      setError('')
      setResult(decrypted)
      setSuccessMsg(decrypted !== result ? 'Successfully decrypted' : 'Already decrypted')
    } else {
      setError('Invalid pin or value')
    }
    setLastAction('decrypt')
  }

  const handleReset = () => {
    setPin('')
    setValue('')
    setError('')
    setResult('')
    setSuccessMsg('')
    setDisableCopy(true)
  }

  const handleCopy = async () => {
    if (result) {
      const resultArea = document.getElementById('result') as HTMLInputElement
      resultArea.focus()
      resultArea.select()
      document.execCommand('copy')
      // await navigator.clipboard.writeText(result)
      setCopied(true)
      setDisableCopy(true)
      setTimeout(() => {
        setCopied(false)
        setDisableCopy(false)
        if (lastAction === 'decrypt') {
          setPin('')
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
            <Text strong>made for Notion</Text>
          </Space>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '.5rem',
          }}>
            <Text strong>PIN</Text>
            <Space size={'middle'}>
              <div style={{
                width: '15rem'
              }}>
                <Input.Password
                  placeholder="PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <Button
                type="default"
                onClick={() => handleReset()}
                disabled={(!value && !result && !pin)}
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
              disabled={(!pin || !value)}
              icon={<LockFilled/>}
            >Encrypt</Button>
            <Button
              type="default"
              onClick={() => handleDecrypt()}
              disabled={(!pin || !value)}
              icon={<UnlockFilled/>}
            >Decrypt</Button>
          </Space>
          <Space.Compact style={{ width: '100%' }}>
            <Input placeholder="Result" readOnly value={result} variant={'filled'} id={'result'}/>
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
