import { useNavigate } from 'react-router-dom'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    
    <div className="grid grid-cols-4 grid-rows-5 gap-4 h-screen bg-primary">
      
      
        <div className="col-span-4 row-span-2 flex items-center justify-center">
          <h1 className='font-primary text-5xl md:text-6xl font-bold text-tertiary'>Welcome</h1>
        </div>

        <div className="col-span-2 row-span-2 row-start-3 bg-amber-600">6</div>
        
        <div className="col-span-2 row-span-2 col-start-3 row-start-3 bg-green-500">7</div>
        
        <div className="col-span-4 row-start-5 bg-blue-500">
          <button onClick={() => navigate('/choose')}>Go to Choose</button>
        </div>

    </div>
  )
}
