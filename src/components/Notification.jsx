import PropTypes from 'prop-types'

const Notification = ({ message }) =>
  message !== '' && (
    <>
      <div
        style={{
          color: 'black',
          border: '5px solid black',
          fontSize: 30,
          background: 'grey',
        }}
      >
        {message}
      </div>
    </>
  )

Notification.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Notification
