import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// --- Theme Constants ---
class VynkTheme {
  static const Color darkNavy = Color(0xFF0B1020);
  static const Color purple = Color(0xFF7B2FF7);
  static const Color pink = Color(0xFFF72585);
  static const Color blue = Color(0xFF2563EB);
  static const Color white = Color(0xFFF8FAFC);

  static BoxDecoration mainGradient = const BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [darkNavy, Color(0xFF1E1B4B), Color(0xFF2E1065)],
    ),
  );
}

// --- Main Auth Flow Orchestrator ---
class VynkAuthFlow extends StatefulWidget {
  const VynkAuthFlow({super.key});

  @override
  State<VynkAuthFlow> createState() => _VynkAuthFlowState();
}

class _VynkAuthFlowState extends State<VynkAuthFlow> {
  final PageController _pageController = PageController();

  void _nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutCubic,
    );
  }

  void _goToPage(int index) {
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          SplashScreen(onComplete: _nextPage),
          WelcomeScreen(onContinue: _nextPage),
          MobileLoginScreen(onOtpSent: _nextPage),
          OtpVerificationScreen(onVerified: _nextPage),
          ProfileSelectionScreen(
            onCreatorSelected: () => _goToPage(5),
            onBrandSelected: () => _goToPage(6),
          ),
          CreatorOnboardingScreen(onComplete: () => _goToPage(7)),
          BrandOnboardingScreen(onComplete: () => _goToPage(7)),
          const DashboardPreviewScreen(),
        ],
      ),
    );
  }
}

// --- SCREEN 1: SPLASH SCREEN ---
class SplashScreen extends StatefulWidget {
  final VoidCallback onComplete;
  const SplashScreen({super.key, required this.onComplete});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Timer(const Duration(seconds: 3), widget.onComplete);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _LogoWidget(size: 100, glow: true),
            const SizedBox(height: 24),
            Text(
              'Vynk',
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: 40,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Connect. Collaborate. Grow.',
              style: GoogleFonts.inter(
                color: Colors.white.withOpacity(0.5),
                fontSize: 14,
                letterSpacing: 2,
              ),
            ),
            const SizedBox(height: 60),
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(VynkTheme.purple),
              strokeWidth: 2,
            ),
          ],
        ),
      ),
    );
  }
}

// --- SCREEN 2: WELCOME SCREEN ---
class WelcomeScreen extends StatelessWidget {
  final VoidCallback onContinue;
  const WelcomeScreen({super.key, required this.onContinue});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            children: [
              const Spacer(),
              _LogoWidget(size: 60),
              const SizedBox(height: 40),
              Text(
                "India’s Creator\nCollaboration Platform",
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                "Connect creators and brands seamlessly",
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  color: Colors.white60,
                  fontSize: 16,
                ),
              ),
              const Spacer(),
              _GradientButton(text: "Join as Creator", onPressed: onContinue),
              const SizedBox(height: 12),
              _GradientButton(
                text: "Join as Brand",
                onPressed: onContinue,
                colors: const [VynkTheme.blue, VynkTheme.purple],
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: onContinue,
                child: Text(
                  "Continue with Mobile Number",
                  style: GoogleFonts.inter(color: Colors.white70),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

// --- SCREEN 3: MOBILE LOGIN ---
class MobileLoginScreen extends StatelessWidget {
  final VoidCallback onOtpSent;
  const MobileLoginScreen({super.key, required this.onOtpSent});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const SizedBox(height: 40),
              _LogoWidget(size: 60),
              const SizedBox(height: 60),
              _GlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Login with Mobile Number",
                      style: GoogleFonts.inter(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),
                    _MobileInput(),
                    const SizedBox(height: 24),
                    _GradientButton(text: "Send OTP", onPressed: onOtpSent),
                    const SizedBox(height: 16),
                    Center(
                      child: Text(
                        "By continuing, you agree to our Terms & Privacy",
                        style: GoogleFonts.inter(color: Colors.white24, fontSize: 11),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              _SocialLoginSection(),
            ],
          ),
        ),
      ),
    );
  }
}

// --- SCREEN 4: OTP VERIFICATION ---
class OtpVerificationScreen extends StatefulWidget {
  final VoidCallback onVerified;
  const OtpVerificationScreen({super.key, required this.onVerified});

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  bool _isLoading = false;

  void _handleVerify() {
    setState(() => _isLoading = true);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() => _isLoading = false);
        widget.onVerified();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const SizedBox(height: 40),
              _LogoWidget(size: 60),
              const SizedBox(height: 60),
              _GlassCard(
                child: Column(
                  children: [
                    Text(
                      "Verify OTP",
                      style: GoogleFonts.inter(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text("Enter the 6-digit code sent to +91 98765 43210", style: TextStyle(color: Colors.white60, fontSize: 13)),
                    const SizedBox(height: 32),
                    _OtpInputRow(),
                    const SizedBox(height: 32),
                    _isLoading 
                      ? const CircularProgressIndicator(color: VynkTheme.purple)
                      : _GradientButton(text: "Verify OTP", onPressed: _handleVerify),
                    const SizedBox(height: 20),
                    const Text("Resend OTP in 00:30", style: TextStyle(color: Colors.white38, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- SCREEN 5: PROFILE SELECTION ---
class ProfileSelectionScreen extends StatelessWidget {
  final VoidCallback onCreatorSelected;
  final VoidCallback onBrandSelected;
  const ProfileSelectionScreen({super.key, required this.onCreatorSelected, required this.onBrandSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              const SizedBox(height: 40),
              Text(
                "I am a...",
                style: GoogleFonts.inter(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 40),
              _SelectionCard(
                title: "Creator",
                subtitle: "I want to collaborate with brands",
                icon: Icons.auto_awesome_rounded,
                onTap: onCreatorSelected,
              ),
              const SizedBox(height: 20),
              _SelectionCard(
                title: "Brand",
                subtitle: "I want to find the best creators",
                icon: Icons.business_center_rounded,
                onTap: onBrandSelected,
                color: VynkTheme.blue,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- SCREEN 6: CREATOR ONBOARDING ---
class CreatorOnboardingScreen extends StatelessWidget {
  final VoidCallback onComplete;
  const CreatorOnboardingScreen({super.key, required this.onComplete});

  @override
  Widget build(BuildContext context) {
    return _OnboardingTemplate(
      title: "Creator Profile",
      onComplete: onComplete,
      fields: [
        _OnboardingField(label: "Instagram Username", icon: Icons.camera_alt_outlined),
        _OnboardingField(label: "Followers Count", icon: Icons.people_outline),
        _OnboardingField(label: "Niche (e.g. Tech, Fashion)", icon: Icons.category_outlined),
        _OnboardingField(label: "City", icon: Icons.location_on_outlined),
        _OnboardingField(label: "Collaboration Pricing (₹)", icon: Icons.payments_outlined),
      ],
    );
  }
}

// --- SCREEN 7: BRAND ONBOARDING ---
class BrandOnboardingScreen extends StatelessWidget {
  final VoidCallback onComplete;
  const BrandOnboardingScreen({super.key, required this.onComplete});

  @override
  Widget build(BuildContext context) {
    return _OnboardingTemplate(
      title: "Brand Profile",
      onComplete: onComplete,
      fields: [
        _OnboardingField(label: "Brand Name", icon: Icons.business),
        _OnboardingField(label: "Industry", icon: Icons.factory_outlined),
        _OnboardingField(label: "Monthly Budget (₹)", icon: Icons.account_balance_wallet_outlined),
        _OnboardingField(label: "Preferred Category", icon: Icons.ads_click),
        _OnboardingField(label: "Contact Email", icon: Icons.alternate_email),
      ],
    );
  }
}

// --- SCREEN 8: DASHBOARD PREVIEW ---
class DashboardPreviewScreen extends StatelessWidget {
  const DashboardPreviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Hello, Vynk Creator!", style: GoogleFonts.inter(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                      const Text("Active Campaigns: 12", style: TextStyle(color: Colors.white60)),
                    ],
                  ),
                  const CircleAvatar(backgroundColor: VynkTheme.purple, child: Icon(Icons.person, color: Colors.white)),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                children: [
                  _DashboardCard(title: "Engagement rate", value: "8.2%", icon: Icons.insights, color: Colors.greenAccent),
                  _DashboardCard(title: "Pending Payouts", value: "₹45,000", icon: Icons.wallet, color: Colors.amberAccent),
                  const SizedBox(height: 20),
                  Text("New Campaigns", style: GoogleFonts.inter(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  _CampaignTile(name: "Apple Music", budget: "₹1,20,000"),
                  _CampaignTile(name: "Nike India", budget: "₹85,000"),
                  _CampaignTile(name: "Starbucks", budget: "₹40,000"),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// --- SHARED REUSABLE COMPONENTS ---

class _LogoWidget extends StatelessWidget {
  final double size;
  final bool glow;
  const _LogoWidget({required this.size, this.glow = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(size * 0.3),
        gradient: const LinearGradient(colors: [VynkTheme.purple, VynkTheme.pink]),
        boxShadow: glow ? [BoxShadow(color: VynkTheme.purple.withOpacity(0.5), blurRadius: 40, spreadRadius: 5)] : null,
      ),
      child: Center(
        child: Text(
          'V',
          style: TextStyle(color: Colors.white, fontSize: size * 0.6, fontWeight: FontWeight.w900, letterSpacing: -size * 0.05),
        ),
      ),
    );
  }
}

class _GradientButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final List<Color> colors;
  const _GradientButton({required this.text, required this.onPressed, this.colors = const [VynkTheme.purple, VynkTheme.pink]});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(colors: colors),
        boxShadow: [BoxShadow(color: colors.first.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))],
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(backgroundColor: Colors.transparent, shadowColor: Colors.transparent, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
        child: Text(text, style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
      ),
    );
  }
}

class _GlassCard extends StatelessWidget {
  final Widget child;
  const _GlassCard({required this.child});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(28),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(28), border: Border.all(color: Colors.white.withOpacity(0.1))),
          child: child,
        ),
      ),
    );
  }
}

class _MobileInput extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white10)),
      child: Row(
        children: const [
          Text("🇮🇳", style: TextStyle(fontSize: 20)),
          SizedBox(width: 8),
          Text("+91", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          SizedBox(width: 12),
          Expanded(
            child: TextField(
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(hintText: "Mobile Number", hintStyle: TextStyle(color: Colors.white24), border: InputBorder.none, contentPadding: EdgeInsets.symmetric(vertical: 18)),
            ),
          ),
          Icon(Icons.phone_android, color: Colors.white24),
        ],
      ),
    );
  }
}

class _SocialLoginSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(children: const [Expanded(child: Divider(color: Colors.white10)), Padding(padding: EdgeInsets.symmetric(horizontal: 16), child: Text("OR", style: TextStyle(color: Colors.white24))), Expanded(child: Divider(color: Colors.white10))]),
        const SizedBox(height: 32),
        _SocialBtn(label: "Google", icon: Icons.g_mobiledata),
        const SizedBox(height: 12),
        _SocialBtn(label: "Instagram", icon: Icons.camera_alt_outlined),
      ],
    );
  }
}

class _SocialBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  const _SocialBtn({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 52,
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white10)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [Icon(icon, color: Colors.white70), const SizedBox(width: 12), Text("Continue with $label", style: const TextStyle(color: Colors.white70))],
      ),
    );
  }
}

class _SelectionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;
  final Color color;
  const _SelectionCard({required this.title, required this.subtitle, required this.icon, required this.onTap, this.color = VynkTheme.purple});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(24), border: Border.all(color: color.withOpacity(0.3))),
        child: Row(
          children: [
            Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle), child: Icon(icon, color: color, size: 30)),
            const SizedBox(width: 20),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)), const SizedBox(height: 4), Text(subtitle, style: const TextStyle(color: Colors.white54, fontSize: 13))])),
            const Icon(Icons.arrow_forward_ios, color: Colors.white24, size: 16),
          ],
        ),
      ),
    );
  }
}

class _OnboardingTemplate extends StatelessWidget {
  final String title;
  final List<Widget> fields;
  final VoidCallback onComplete;
  const _OnboardingTemplate({required this.title, required this.fields, required this.onComplete});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: VynkTheme.mainGradient,
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.inter(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
              const SizedBox(height: 32),
              Center(
                child: CircleAvatar(
                  radius: 50,
                  backgroundColor: Colors.white.withOpacity(0.1),
                  child: const Icon(Icons.add_a_photo_outlined, color: Colors.white54, size: 30),
                ),
              ),
              const SizedBox(height: 32),
              ...fields,
              const SizedBox(height: 40),
              _GradientButton(text: "Complete Setup", onPressed: onComplete),
            ],
          ),
        ),
      ),
    );
  }
}

class _OnboardingField extends StatelessWidget {
  final String label;
  final IconData icon;
  const _OnboardingField({required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white10)),
        child: TextField(
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(labelText: label, labelStyle: const TextStyle(color: Colors.white38), prefixIcon: Icon(icon, color: Colors.white24), border: InputBorder.none),
        ),
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  const _DashboardCard({required this.title, required this.value, required this.icon, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(20)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(children: [Icon(icon, color: color), const SizedBox(width: 16), Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(color: Colors.white60)), Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold))])]),
          const Icon(Icons.trending_up, color: Colors.greenAccent),
        ],
      ),
    );
  }
}

class _CampaignTile extends StatelessWidget {
  final String name;
  final String budget;
  const _CampaignTile({required this.name, required this.budget});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white.withOpacity(0.03), borderRadius: BorderRadius.circular(16)),
      child: Row(
        children: [
          Container(width: 48, height: 48, decoration: BoxDecoration(color: VynkTheme.purple.withOpacity(0.2), borderRadius: BorderRadius.circular(12)), child: const Icon(Icons.campaign, color: VynkTheme.purple)),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)), const Text("Campaign Live", style: TextStyle(color: Colors.white38, fontSize: 12))])),
          Text(budget, style: const TextStyle(color: VynkTheme.pink, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class _OtpInputRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: List.generate(6, (index) => Container(width: 45, height: 55, decoration: BoxDecoration(color: Colors.white.withOpacity(0.05), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.white10)), child: const Center(child: TextField(textAlign: TextAlign.center, keyboardType: TextInputType.number, maxLength: 1, style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold), decoration: InputDecoration(counterText: "", border: InputBorder.none))))),
    );
  }
}
