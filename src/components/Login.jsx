import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/components/Login.module.scss'

export default function Login() {
    const navigate = useNavigate()

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('adminSession') === 'true'
        if (isAuthenticated) {
            navigate('/admin/dashboard')
        }
    }, [navigate])

    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: form.username, password: form.password })
            });

            const data = await res.json();

            if (res.ok && data.status === 'success') {
                // 紀錄 Session 和 使用者名稱
                localStorage.setItem('adminSession', 'true')
                localStorage.setItem('adminUser', data.user.account)
                navigate('/admin/dashboard')
            } else {
                setError(data.message || '帳號或密碼錯誤')
                setLoading(false)
            }
        } catch (err) {
            console.error('Login request failed:', err);
            setError('無法連線到伺服器，請重試')
            setLoading(false)
        }
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
