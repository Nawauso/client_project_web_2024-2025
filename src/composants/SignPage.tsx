export function SignPage() {

    return (
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
            <button >Back</button>
            <button type="submit">Sign in</button>
        </form>
    )
}