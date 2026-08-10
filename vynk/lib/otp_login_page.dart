import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class OtpLoginPage extends StatefulWidget {
  const OtpLoginPage({super.key});

  @override
  State<OtpLoginPage> createState() => _OtpLoginPageState();
}

class _OtpLoginPageState extends State<OtpLoginPage> {
  bool showOtpField = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 1. Elegant Gradient Background with Waves
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF0B1020), // Dark Navy
                  Color(0xFF1E1B4B), // Deep Indigo
                  Color(0xFF2E1065), // Deep Purple
                ],
              ),
            ),
          ),
          
          // Abstract Gradient Waves/Glows
          Positioned(
            top: -100,
            right: -100,
            child: _buildGlowCircle(const Color(0xFF7B2FF7).withOpacity(0.15), 400),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: _buildGlowCircle(const Color(0xFFF72585).withOpacity(0.1), 300),
          ),

          // 2. Subtle Floating Elements
          Positioned(
            top: 250,
            left: 20,
            child: _buildFloatingElement(Icons.bar_chart_rounded, 40, Colors.blueAccent.withOpacity(0.05)),
          ),
          Positioned(
            top: 450,
            right: 30,
            child: _buildFloatingElement(Icons.star_rounded, 30, Colors.pinkAccent.withOpacity(0.05)),
          ),

          // 3. Main Content
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 30),
                  
                  // Top Section: Logo & Brand
                  _buildPremiumLogo(),
                  const SizedBox(height: 12),
                  Text(
                    'Vynk',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -1,
                    ),
                  ),
                  Text(
                    'Connect. Collaborate. Grow.',
                    style: GoogleFonts.inter(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 13,
                      letterSpacing: 1.5,
                      fontWeight: FontWeight.w400,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Join Section (Top prominence)
                  Row(
                    children: [
                      Expanded(child: _buildOutlineButton('Join as Creator')),
                      const SizedBox(width: 12),
                      Expanded(child: _buildOutlineButton('Join as Brand')),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // 4. Glassmorphism Card
                  _buildGlassCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          showOtpField ? 'Verify OTP' : 'Login with Mobile',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          showOtpField 
                            ? 'Enter the 6-digit code sent to your phone'
                            : 'Enter your mobile number to continue',
                          style: GoogleFonts.inter(
                            color: Colors.white60,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 24),

                        if (!showOtpField) ...[
                          _buildMobileInput(),
                          const SizedBox(height: 24),
                          _buildGradientButton('Send OTP', () {
                            setState(() => showOtpField = true);
                          }),
                        ] else ...[
                          _buildOtpInputRow(),
                          const SizedBox(height: 24),
                          _buildGradientButton('Verify OTP', () {}),
                          const SizedBox(height: 16),
                          Center(
                            child: RichText(
                              text: TextSpan(
                                style: GoogleFonts.inter(fontSize: 13, color: Colors.white54),
                                children: const [
                                  TextSpan(text: "Didn't receive code? "),
                                  TextSpan(
                                    text: "Resend (00:30)",
                                    style: TextStyle(color: Color(0xFF7B2FF7), fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // 5. Social Login
                  Row(
                    children: [
                      const Expanded(child: Divider(color: Colors.white10)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'OR',
                          style: GoogleFonts.inter(color: Colors.white24, fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ),
                      const Expanded(child: Divider(color: Colors.white10)),
                    ],
                  ),
                  const SizedBox(height: 32),

                  _buildSocialButton('Continue with Google', Icons.g_mobiledata_rounded, Colors.white),
                  const SizedBox(height: 12),
                  _buildSocialButton('Continue with Instagram', Icons.camera_alt_outlined, const Color(0xFFF72585)),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGlowCircle(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: color,
            blurRadius: 100,
            spreadRadius: 50,
          ),
        ],
      ),
    );
  }

  Widget _buildPremiumLogo() {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [Color(0xFF7B2FF7), Color(0xFFF72585)],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7B2FF7).withOpacity(0.4),
            blurRadius: 30,
            spreadRadius: 2,
          )
        ],
      ),
      child: const Center(
        child: Text(
          'V',
          style: TextStyle(
            color: Colors.white,
            fontSize: 44,
            fontWeight: FontWeight.w800,
            letterSpacing: -2,
          ),
        ),
      ),
    );
  }

  Widget _buildGlassCard({required Widget child}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(32),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.04),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: child,
        ),
      ),
    );
  }

  Widget _buildMobileInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        children: [
          const Text("🇮🇳", style: TextStyle(fontSize: 20)),
          const SizedBox(width: 8),
          const Text("+91", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          const SizedBox(width: 12),
          const Expanded(
            child: TextField(
              keyboardType: TextInputType.phone,
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: "Enter Mobile Number",
                hintStyle: TextStyle(color: Colors.white24, fontSize: 14),
                border: InputBorder.none,
                contentPadding: EdgeInsets.symmetric(vertical: 18),
              ),
            ),
          ),
          Icon(Icons.phone_iphone_rounded, color: Colors.white.withOpacity(0.2), size: 20),
        ],
      ),
    );
  }

  Widget _buildOtpInputRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (index) => _buildOtpBox()),
    );
  }

  Widget _buildOtpBox() {
    return Container(
      width: 45,
      height: 55,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white10),
      ),
      child: const Center(
        child: TextField(
          textAlign: TextAlign.center,
          keyboardType: TextInputType.number,
          maxLength: 1,
          style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
          decoration: InputDecoration(
            counterText: "",
            border: InputBorder.none,
          ),
        ),
      ),
    );
  }

  Widget _buildGradientButton(String text, VoidCallback onPressed) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [Color(0xFF2563EB), Color(0xFF7B2FF7)],
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2563EB).withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: Text(
          text,
          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildSocialButton(String label, IconData icon, Color iconColor) {
    return Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.white.withOpacity(0.03),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: iconColor, size: 24),
            const SizedBox(width: 12),
            Text(
              label,
              style: GoogleFonts.inter(color: Colors.white.withOpacity(0.9), fontSize: 14, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOutlineButton(String text) {
    return OutlinedButton(
      onPressed: () {},
      style: OutlinedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        side: BorderSide(color: Colors.white.withOpacity(0.12)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      child: Text(
        text,
        style: GoogleFonts.inter(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500),
      ),
    );
  }

  Widget _buildFloatingElement(IconData icon, double size, Color color) {
    return Icon(icon, size: size, color: color);
  }
}
