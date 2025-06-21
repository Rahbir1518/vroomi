import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={() => navigate('/choose')}>Go to Choose</button>
    </div>
  )
}
