import { useNavigate } from 'react-router-dom'

export default function Choose() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Choose</h1>
      <button onClick={() => navigate('/driver')}>I am a Driver</button>
      <button onClick={() => navigate('/rider')}>I am a Rider</button>
    </div>
  )
}
