import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/components/Login.module.scss'

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        // 簡單驗證（可之後接 API）
        setTimeout(() => {
            if (form.username === 'admin' && form.password === 'squirrel') {
                navigate('/admin/dashboard')
            } else {
                setError('帳號或密碼錯誤，請重新輸入')
                setLoading(false)
            }
        }, 600)
    }

    return (
        <section className={styles.loginPage}>
            <div className={styles.card}>
                <div className={styles.logoArea}>
                    <img src="/images/logo-squirrel-detective.png" alt="松鼠窩 Logo" className={styles.logo} />
                    <h1 className={styles.title}>管理後台登入</h1>
                    <p className={styles.subtitle}>松鼠窩 · 窩作夥</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="username" className={styles.label}>帳號</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className={styles.input}
                            placeholder="請輸入帳號"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="password" className={styles.label}>密碼</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={styles.input}
                            placeholder="請輸入密碼"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? '登入中...' : '登入'}
                    </button>
                </form>
                <Link to="/" className={styles.linkTag}>
                   <span>回到窩作夥主頁</span>
                </Link>
            </div>
        </section>
    )
}
