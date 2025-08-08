const { Fragment } = React

export function UserPreview({ user }) {
    return (
        <Fragment>
            <span>Username : {user.username}</span>
            <span>Fullname : {user.fullname}</span>
        </Fragment>
    )
}