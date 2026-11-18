import { Link } from 'react-router-dom'
import { formatDate, listConversations } from '../../services/conversations'

function ConversationsView() {
  const conversations = listConversations()

  return (
    <section className="view">
      <h1>Conversaciones</h1>
      <p>{conversations.length} conversaciones guardadas.</p>

      <ul className="conversation-list">
        {conversations.map((c) => (
          <li key={c.id}>
            <Link to={`/conversaciones/${c.id}`}>{c.title}</Link>
            <small>{formatDate(c.createdAt)}</small>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ConversationsView
