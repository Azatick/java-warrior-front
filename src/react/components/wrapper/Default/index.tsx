import * as React from 'react'

import Layout from '../../layout'
import PageWrapperProps from '../../../interfaces/props/PageWrapperProps'
import Abstract from '../../abstract'

import './styles.scss';
import b_ from '../../../../utils/BEM';

interface Props {

}

interface State {

}

export default class DefaultWrapper extends React.Component<Props, State> {

    render() {
        let main_ = b_('main')

        return (
            <main className={main_()}>
                <Layout.Header classNames={[main_({elem: 'header'})]}/>
                <div className={main_({elem: 'content'})}>
                    {this.props.children}
                </div>
            </main>
        )
    }

}
