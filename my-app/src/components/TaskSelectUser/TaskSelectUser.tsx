import React from 'react';
import { UserSelectProps } from '../../types/Task.type';

class UserSelect extends React.Component<UserSelectProps> {
    render() {
        const {userIds, onUserChange} = this.props;

        return(
            <select onChange={(e) => onUserChange(+(e.target.value))}>
                <option value={undefined}></option>
                <option value="">All users</option>
                {userIds.map(id => (
                    <option key={id} value={id}>
                        User id: {id}
                    </option>
                ))}
            </select>
        );
    }
}

export default UserSelect;