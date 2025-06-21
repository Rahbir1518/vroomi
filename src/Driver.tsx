import { useNavigate } from 'react-router-dom'

export default function Driver() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Driver Page</h1>
      <button onClick={() => navigate('/rider')}>Go to Rider</button>
    </div>
  )
}
